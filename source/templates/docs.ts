import {README, config } from "./README"
import type {IREADME } from "./README"

export interface IGENERATOR {
}

export function BUILD() {
    const data = README(config)
} 