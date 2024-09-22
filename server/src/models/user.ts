import mongoose from "mongoose"
import bcrypt from "bcrypt-nodejs"

interface IUser extends mongoose.Document {
    fullName: string,
    email: string,
    password: string,
    address: string,
    otp: string,
    isActivated: boolean,
    comparePassword: (password: string) => boolean
}

const UserSchema = new mongoose.Schema<IUser>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: false,
        expires: 60 * 5
    },
    isActivated: {
        type: Boolean,
        required: false
    }
})

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
    const user = this

    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next()

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next()
        
        user.password = hash
        next()
    })
})

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password: string) {
    return bcrypt.compareSync(password, this.password)
}

export const UserModel: mongoose.Model<IUser> = mongoose.model('User', UserSchema)