import config from "../config";
import { User } from "../modules/User/user.model";

const superUSer = {
  email: "niloyroy184@gmail.com",
  password: config.admin_password,
  role: "admin",
};

const seedSuperAdmin = async () => {
  // when database is connected , we will check is there any user who is super admin

  const isSuperAdminExists = await User.findOne({ role: "admin" });

  if (!isSuperAdminExists) {
    await User.create(superUSer);
  }
};
export default seedSuperAdmin;
