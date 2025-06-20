import config from "@/config"
import passport from "passport"
import GoogleStrategy from "passport-google-oauth2"

import User from "@/models/user.model"

import { signAuthTokens } from "@/utils/auth"

const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: config.GOOGLE.clientId,
    clientSecret: config.GOOGLE.clientSecret,
    callbackURL: `${config.baseURL}/auth/google/callback`,
    scope: ["profile"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({
        googleId: profile.id,
      })

      if (!user) {
        // create a new user
        user = new User({
          display_name: profile.displayName,
          email: profile.email,
          googleId: profile.id,
          personal: {
            first_name: profile.family_name,
            last_name: profile.given_name,
          },
          image: profile.picture,
        })

        await user.save({ validateBeforeSave: false })
      }

      // sign tokens and pass token to google callback alongside user details
      const tokens = signAuthTokens(user!._id.toString())

      return done(null, { user, tokens })
    } catch (error) {
      return done(error, null)
    }
  }
)

passport.use(googleStrategy)
