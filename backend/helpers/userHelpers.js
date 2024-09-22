import bcrypt from "bcrypt"

export const hashPassword = async(plainPassword)=>{
    try {
        const hashedPassword = await bcrypt.hash(plainPassword,10)
        return hashedPassword
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async(plainPassword,hashedPassword)=>{
    return bcrypt.compare(plainPassword,hashedPassword)
}