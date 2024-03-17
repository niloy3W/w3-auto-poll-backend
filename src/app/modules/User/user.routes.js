import { Router } from "express";
import { UserController } from "./user.controller";
import { ZodValidation } from "./user.validation";
import ValidateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
const router = Router();

router.post(
  "/register",
  ValidateRequest(ZodValidation.UserValidationSchema),
  UserController.createUser
);
router.get(
  "/get-all-users",
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserController.getAllUsers
);
router.get(
  "/get-user-data/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserController.getSpecificUsers
);
router.post(
  "/assign-parent/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserController.assignParent
);

export const UserRoutes = router;
