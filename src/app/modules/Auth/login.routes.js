import { Router } from "express";
import { AuthControllers } from "./login.controller";

const router = Router();
// login a user
router.post("/login", AuthControllers.loginAUser);

router.post("/refresh-token", AuthControllers.refreshToken);

export const AuthRoutes = router;
