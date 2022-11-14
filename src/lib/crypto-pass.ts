import bcrypt from "bcrypt";

const hashPass = async (unHashPass: string): Promise<string> => {
  const hash = await bcrypt.hash(unHashPass, 10);
  return hash;
};

const isSamePass = async (
  unHashPass: string,
  hashPass: string
): Promise<boolean> => {
  const result = await bcrypt.compare(unHashPass, hashPass);
  return result;
};

export { hashPass, isSamePass };
