import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import loginHelpRouter from "./login-help";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(loginHelpRouter);

export default router;
