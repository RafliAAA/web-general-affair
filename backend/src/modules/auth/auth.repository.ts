import prisma from "../../config/prisma";

const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const createUser = async (data:{
    email: string,
    password: string,
}) => {
    return await prisma.user.create({data})
}

export default {
  findUserByEmail,
  createUser,
};
