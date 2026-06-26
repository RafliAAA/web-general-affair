import userRepository from "./user.repository";
import type { CreateUserByAdminDTO, UpdateUserDTO } from "./user.dto";
import bcrypt from "bcrypt";

const createUserByAdmin = async (data: CreateUserByAdminDTO) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await userRepository.createUserByAdmin({
    ...data,
    password: hashedPassword,
  });

  const { password, ...secureUser } = user;
  return secureUser;
};

const getAllUsers = async () => {
  const users = await userRepository.getAllUsers();
  return users.map(({ password, ...secureUser }) => secureUser);
};

const getUserById = async (user_id: string) => {
  const user = await userRepository.getUserById(user_id);
  if (!user) throw new Error("User not found");

  const { password, ...secureUser } = user;
  return secureUser;
};

// const updateUser = async (user_id: string, data: UpdateUserDTO) => {
//   const updateData: any = { ...data };

//   // Jika admin melakukan update password, hash dulu password barunya
//   if (data.password) {
//     updateData.password = await bcrypt.hash(data.password, 10);
//   }

//   const user = await userRepository.updateUser(user_id, updateData);

//   const { password, ...secureUser } = user;
//   return secureUser;
// };

export default {
  createUserByAdmin,
  getAllUsers,
  getUserById,
//   updateUser,
};
