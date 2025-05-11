import { Request, Router } from "express";
import { container } from "../configurations/dependency-injection/container";
import { DI } from "../configurations/dependency-injection/symbols";
import { AuthenticationServiceInterface } from "../services/AuthenticationService/Interface";

type SignInRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export const router = Router();

/**
 * @swagger
 * /authentication/sign-in:
 *   post:
 *     summary: Sign in with email and password
 *     description: Authenticates a user with their email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignInResponse'
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/sign-in", async (req: Request<SignInRequest>, res) => {
  const { email, password } = req.body;
  const authenticationService: AuthenticationServiceInterface =
    container.get<AuthenticationServiceInterface>(
      DI.AuthenticationServiceInterface,
    );

  try {
    const authData = await authenticationService.signIn({ email, password });

    res.status(200).json(authData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error signing in", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error signing in", error: "Unknown error" });
    }
  }
});

/**
 * @swagger
 * /authentication/sign-out:
 *   post:
 *     summary: Signs out a user
 *     description: Signs out a user.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successful sign out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignOutResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/sign-out", async (req: Request, res) => {
  const authenticationService: AuthenticationServiceInterface =
    container.get<AuthenticationServiceInterface>(
      DI.AuthenticationServiceInterface,
    );

  try {
    await authenticationService.signOut();
    res.status(200).json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error signing out", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error signing out", error: "Unknown error" });
    }
  }
});

/**
 * @swagger
 * /authentication/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with an email, password, and name.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword123"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "63f2b0e5b7a1d9a8e9b8c4d1"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email format"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error registering user"
 */
router.post("/register", async (req: Request<RegisterRequest>, res) => {
  const { email, password, name } = req.body;
  const authenticationService: AuthenticationServiceInterface =
    container.get<AuthenticationServiceInterface>(
      DI.AuthenticationServiceInterface,
    );

  try {
    const newUser = await authenticationService.register({
      email,
      password,
      name,
    });

    res.status(201).json(newUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error registering user", error: "Unknown error" });
    }
  }
});

/**
 * @swagger
 * /authentication/users:
 *   post:
 *     summary: Retrieve a user with email and password
 *     description: Fetches a user from the system based on provided email and password for authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully retrieved the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post("/users", async (req: Request<SignInRequest>, res) => {
  const { email, password } = req.body;
  const authenticationService: AuthenticationServiceInterface =
    container.get<AuthenticationServiceInterface>(
      DI.AuthenticationServiceInterface,
    );

  try {
    const user = await authenticationService.fetchAllUsers({ email, password });
    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(500).json({
      message: "Error fetching user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /authentication/isAdmin:
 *   post:
 *     summary: Check if a user is an admin
 *     description: Verifies whether a user has admin privileges based on their ID.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "63f2b0e5b7a1d9a8e9b8c4d1"
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: User role verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post("/isAdmin", async (req: Request<{ id: string }>, res) => {
  const { id } = req.body;
  const authenticationService: AuthenticationServiceInterface =
    container.get<AuthenticationServiceInterface>(
      DI.AuthenticationServiceInterface,
    );

  try {
    const isAdmin = await authenticationService.checkAdminStatus(id);
    res.status(200).json({ isAdmin });
  } catch (error: unknown) {
    res.status(500).json({
      message: "Error checking admin status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

