export const PROGRAM = {
    DEPENDENCY_LEVEL: 0 as const
} as const


export const MESSAGES = {
    print: () => {
        console.log("─".repeat(40));
        console.log("🚀 AREPO README Generator");
        console.log("─".repeat(40));
    },
    success: (result: { outputPath: string, sections: readonly string[], timestamp: Date }) => {
        console.log("\n✅ README generation complete!");
        console.log(`📄 Output: ${result.outputPath}`);
        console.log(`📋 Sections: ${result.sections.join(", ")}`);
        console.log(`🕐 Generated at: ${result.timestamp.toISOString()}\n`);
    },
    greeting: "🚀 AREPO README Generator",
    separator: "─".repeat(40),
} as const