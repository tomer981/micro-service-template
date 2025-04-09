module.exports = {
	apps: [
		{
			name: "log-workers",
			script: "npx ts-node -r tsconfig-paths/register ./src/index.ts",
			instances: "max",
			exec_mode: "fork",
			watch: true,
			max_memory_restart: "100M",
			env: {
				NODE_ENV: "development",
			},
			env_development: {
				NODE_ENV: "development",
			},
		},
	],
};
