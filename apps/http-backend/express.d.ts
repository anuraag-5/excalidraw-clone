import "express"

declare module "express" {
    export interface Request extends Request{
        userId?: string
    }
}