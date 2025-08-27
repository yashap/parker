import { AppInfo, RecipeListFunction } from 'supertokens-node/types'

export interface AuthConfig {
  appInfo: AppInfo
  connectionURI: string
  apiKey?: string
  recipeList?: RecipeListFunction[]
}
