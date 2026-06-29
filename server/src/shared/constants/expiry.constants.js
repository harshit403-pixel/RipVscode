const EXPIRY_CONSTANTS = {
    refreshToken: "7d", // 7 days in seconds
    accessToken: "1h", // 1 hour in seconds
    resetToken: 15 * 60 * 1000, // 15 minutes in seconds
    otpToken: 10 * 60 * 1000, // 10 minutes in seconds
}

export default EXPIRY_CONSTANTS;