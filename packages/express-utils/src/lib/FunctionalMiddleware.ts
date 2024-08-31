import { NextFunction, Request, Response } from 'express'

export type FunctionalMiddleware = (request: Request, response: Response, next: NextFunction) => void
