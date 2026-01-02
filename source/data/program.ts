/**
 * Program Data Module
 * Contains program constants and metadata using TUI-enhanced output
 * 
 * @module data/program
 */

import { MESSAGES as TerminalMessages } from "../services/Terminal.js";

// =============================================================================
// Program Constants
// =============================================================================

export const PROGRAM = {
    NAME: "arepodesir",
    VERSION: "1.0.1",
    DESCRIPTION: "The Official README of Arepo Desir",
    DEPENDENCY_LEVEL: 0 as const,
} as const;

// =============================================================================
// Re-export TUI-enhanced MESSAGES
// =============================================================================

export const MESSAGES = TerminalMessages;

// =============================================================================
// Program Metadata
// =============================================================================

export const METADATA = {
    author: "Arepo Desir <arepodesir@gmail.com>",
    repository: "https://github.com/arepodesir/arepodesir.git",
    homepage: "https://whoisarepo.space",
    license: "MIT",
} as const;