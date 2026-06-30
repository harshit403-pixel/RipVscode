import User from "../models/user.model.js";

class UserRepository {
  constructor() {
    this.userModel = User;
  }

  async findUserByEmail(email) {
    return this.userModel.findOne({ email });
  }

  async createUser(userData) {
    return this.userModel.create(userData);
  }

  async updateUser(filter, update) {
    return this.userModel
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .select("-password");
  }

  async getUserById(userId) {
    return this.userModel
      .findById(userId)
      .select("-password");
  }

  async getAllUsers() {
    return this.userModel.select("-password");
  }

  async getUser(filter) {
    return this.userModel
      .findOne(filter)
      .select("-password");
  }
}

export default UserRepository;