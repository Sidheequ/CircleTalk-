import jwt from "jsonwebtoken";


// generate token
export const generateToken = (userId, res) => {


    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true, // Must be true for SameSite: "none"
        sameSite: "none", // Required for cross-domain cookies (Vercel to Render)
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;

}   