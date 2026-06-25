export interface bullet {
    id: string
    x: number
    y: number
}

export interface sleeve {
    id: string
    x: number
    y: number
    rotation: number
}

export interface meteor {
    id: string
    image: string
    x: number
    y: number
    speed: number
    rotation: number
}

export type difficulty = 'easy' | 'normal' | 'hard'