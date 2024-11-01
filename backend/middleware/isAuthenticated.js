import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({message:"You are not authenticated"});
        };
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!verifyToken) {
            return res.status(401).json({message:"Invalid Token"});
        } 
        req.id = verifyToken.userId;

        next();
    } catch (error) {
        console.log(error);       
    }
}

export default isAuthenticated;