import express from "express";
import { authMiddlewares } from "../../middlewares";
import {
  authControllers,
  getAuthControllers,
  google,
  updateAuthControllers,
} from "../../controllers";
import { upload } from "../../services/avatarServices";

const router = express.Router();

router.get("/google", google.googleAuth);

router.get("/google-redirect", google.googleRedirect);

router
  .route("/register")
  .post(authMiddlewares.checkRegistrationData, authControllers.registration);

router
  .route("/login")
  .post(authMiddlewares.checkLoginData, authControllers.login);

router.post("/refresh-token", authControllers.refreshToken);

router.use(authMiddlewares.protect);

router.route("/current").get(getAuthControllers.getCurrentUserInfo);

router
  .route("/current/edit")
  .patch(
    authMiddlewares.checkCurrentUser,
    updateAuthControllers.updateCurrentUser
  );

router.patch("/avatars", upload.single("avatar"), authControllers.updateAvatar);

router
  .route("/current/pets/add")
  .post(
    upload.single("imgURL"),
    authMiddlewares.checkPetData,
    updateAuthControllers.addPet
  );

router
  .route("/current/pets/remove/:id")
  .delete(updateAuthControllers.deletePetById);

router.route("/logout").post(authControllers.logout);

export default router;
