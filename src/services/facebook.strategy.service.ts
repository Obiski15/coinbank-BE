import config from "@/config"
import passport from "passport"
import FacebookStrategy from "passport-facebook"

import User from "@/models/user.model"

import { signAuthTokens } from "@/utils/auth"

const facebookStrategy = new FacebookStrategy.Strategy(
  {
    clientID: config.FACEBOOK.clientId,
    clientSecret: config.FACEBOOK.clientSecret,
    callbackURL: `${config.baseURL}/auth/facebook/callback`,
    profileFields: ["id", "name", "displayName", "photos", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id })

      if (!user) {
        user = new User({
          image: profile.photos?.[0].value,
          display_name: profile.displayName,
          personal: {
            first_name: profile.name?.familyName,
            last_name: profile.name?.givenName,
          },
          facebookId: profile.id,
        })

        await user.save({ validateBeforeSave: false })
      }

      // signTokens
      const tokens = signAuthTokens(user!._id.toString())

      return done(null, { user, tokens })
    } catch (error) {
      return done(error, null)
    }
  }
)

passport.use(facebookStrategy)
