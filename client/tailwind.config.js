/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		colors: {
		  sidebar: {
			DEFAULT: "hsl(var(--sidebar-background))",
			foreground: "hsl(var(--sidebar-foreground))",
			primary: "hsl(var(--sidebar-primary))",
			"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
			accent: "hsl(var(--sidebar-accent))",
			"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
			border: "hsl(var(--sidebar-border))",
			ring: "hsl(var(--sidebar-ring))",
		  },
		},
		animation: {
		  first: "moveVertical 30s ease infinite",
		  second: "moveInCircle 20s reverse infinite",
		  third: "moveInCircle 40s linear infinite",
		  fourth: "moveHorizontal 40s ease infinite",
		  fifth: "moveInCircle 20s ease infinite",
		},
		keyframes: {
		  moveHorizontal: {
			"0%": { transform: "translateX(-50%) translateY(-10%)" },
			"50%": { transform: "translateX(50%) translateY(10%)" },
			"100%": { transform: "translateX(-50%) translateY(-10%)" },
		  },
		  moveInCircle: {
			"0%": { transform: "rotate(0deg)" },
			"50%": { transform: "rotate(180deg)" },
			"100%": { transform: "rotate(360deg)" },
		  },
		  moveVertical: {
			"0%": { transform: "translateY(-50%)" },
			"50%": { transform: "translateY(50%)" },
			"100%": { transform: "translateY(-50%)" },
		  },
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };