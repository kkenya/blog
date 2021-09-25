import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          bio {
            description
          }
        }
      }
    }
  `)
  const { description } = data.site.siteMetadata.bio

  return (
    <div className="bio">
      <p>{description}</p>
    </div>
  )
}

export default Bio
