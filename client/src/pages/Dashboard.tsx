import FileDisplay from "@/components/file-display";
import { FileProvider } from "@/hooks/file-context";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import AuthenticationService from "@/services/AuthenticationService";
import { User } from "@/types/Attribution";
import AttributionService from "@/services/AttributionService";
import { calculateBudgetAlignment, calculateTotalScore } from "@/helpers/UtilHelpers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
    const [selectedSector, setSelectedSector] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filterError, setFilterError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
        console.log(isLoading)
    };

    useEffect(() => {
        if (dialogOpen) {
            const adminEmail = import.meta.env.VITE_POCKETBASE_ADMIN_EMAIL;
            const adminPassword = import.meta.env.VITE_POCKETBASE_ADMIN_PASSWORD;

            if (adminEmail && adminPassword) {
                AuthenticationService.fetchUser({ email: adminEmail, password: adminPassword })
                    .then((data) => {
                        if (Array.isArray(data)) {
                            const formattedUsers = data.map((user) => ({
                                id: user.id,
                                email: user.email,
                                name: user.name || "No Name",
                                avatar: user.avatar || "",
                                verified: user.verified,
                            }));
                            setUsers(formattedUsers);
                        } else {
                            console.error("Unexpected API response format:", data);
                        }
                    })
                    .catch((error) => console.error("Error fetching users:", error));
            } else {
                console.error("Admin credentials are missing in environment variables.");
            }
        }
    }, [dialogOpen]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            AuthenticationService.isAdmin(userId)
                .then((response) => {
                    setIsAdmin(response.isAdmin);
                })
                .catch((error) => {
                    console.error("Error checking admin status:", error);
                });
        }
    }, []);

    const handleAddUser = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "" || password === "" || confirmPassword === "") {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await AuthenticationService.register({ email, password, name: "" });

            console.log("Data:", response);
            setUsers([...users, { id: response.id, email, name: response.name, avatar: response.avatar, verified: true }]);

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAddUserDialogOpen(false);
        } catch (error) {
            console.error("Error registering user:", error);
            setErrorMessage("Failed to register user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadSummary = () => {
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setFilterError("End date must be after start date.");
            return;
        }

        setFilterError("");
        setDownloadDialogOpen(false);

        const fetchAttributions = async () => {
            try {
                const userId = localStorage.getItem("userId") || undefined;
                if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                    setFilterError("End date must be after start date.");
                    return;
                }

                setFilterError("");
                setDownloadDialogOpen(false);
                const data = await AttributionService.getAllAttributions(
                    selectedSector,
                    userId,
                    startDate,
                    endDate
                );

                const updates: { cell: string; value: string }[] = [];
                const maxEntries = 10;

                // Process first 10 entries
                const filteredData = data.slice(0, maxEntries);

                let totalBudgetAlignment = 0;

                for (let index = 0; index < filteredData.length; index++) {
                    const item = filteredData[index];
                    const row = 4 + index;
                    const title = item.expand?.document_id?.title || 'No Title';

                    const attribution = await AttributionService.getAttributionById(item.id);
                    const totalScoreBudget = attribution ? calculateTotalScore([attribution.attribution]) : 0;
                    const budgetAlignment = calculateBudgetAlignment(totalScoreBudget, item.proposed_budget);
                    totalBudgetAlignment += budgetAlignment;

                    // Title
                    updates.push({ cell: `A${row}`, value: title });

                    // Score
                    updates.push({
                        cell: `B${row}`,
                        value: totalScoreBudget.toString()
                    });

                    // Proposed Budget
                    updates.push({
                        cell: `C${row}`,
                        value: item.proposed_budget.toString()
                    });

                    updates.push({
                        cell: `D${row}`,
                        value: budgetAlignment.toString()
                    });
                }

                updates.push({ cell: 'D14', value: totalBudgetAlignment.toString() });

                const sectorPart = selectedSector || "AllSectors";
                const startPart = startDate ? new Date(startDate).toISOString().split('T')[0] : "";
                const endPart = endDate ? new Date(endDate).toISOString().split('T')[0] : "";
                const datePart = startPart && endPart ? `${startPart}_to_${endPart}` : "";

                const fileName = `${sectorPart}_${datePart}_summary.xlsx`
                    .replace(/_{2,}/g, '_')
                    .replace(/_$/, '');


                // Generate and download Excel
                const blob = await AttributionService.fillExcelFileSummary('Summary', updates);

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

            } catch (error) {
                console.error("Error downloading summary:", error);
            }
        };

        fetchAttributions();
    };

    return (
        <div className="relative min-h-screen w-full pl-40 pr-40 pt-10 px-4 ">
            <div className="absolute top-4 right-4">
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="w-6 h-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {isAdmin && (
                            <DropdownMenuItem onClick={() => {
                                setDropdownOpen(false);
                                setDialogOpen(true);
                            }}>
                                Users
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => {
                            setDropdownOpen(false);
                            setDownloadDialogOpen(true);
                        }}>
                            Download Summary
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                        }} className="text-red-500">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Filter Summary</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sector" className="text-right">
                                Sector
                            </Label>
                            <Select value={selectedSector} onValueChange={setSelectedSector}>
                                <SelectTrigger id="sector" className="col-span-3">
                                    <SelectValue placeholder="Select sector" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    <SelectItem value="Health">Health</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right">
                                Start Date
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDate" className="text-right">
                                End Date
                            </Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="col-span-3"
                            />
                        </div>

                        {filterError && (
                            <div className="col-span-4 text-center text-sm text-destructive">
                                {filterError}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDownloadSummary}>Generate</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Manage Users Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Users</DialogTitle>
                    </DialogHeader>
                    <Button variant="outline" className="w-full mb-2 mt-2" onClick={() => setAddUserDialogOpen(true)}>
                        Add User
                    </Button>
                    {users.length > 0 ? (
                        <ul className="space-y-2">
                            {users.map((user) => (
                                <li key={user.id} className="p-2 rounded-md flex items-center gap-3">
                                    <div>{user.email}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No users found.</p>
                    )}
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogContent>
            </Dialog>


            <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="email" className="peer-focus:text-gray-600">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="password" className="peer-focus:text-gray-600">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="confirmPassword" className="peer-focus:text-gray-600">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                            />
                        </div>
                    </div>{errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddUser}>Add</Button>
                    </div>

                </DialogContent>
            </Dialog>

            <FileProvider>
                <FileDisplay />
            </FileProvider>
        </div>
    );
}