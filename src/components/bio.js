/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js

  return (
    <div className="bio">
      <p>やったことを残しておく備忘録</p>
    </div>
  )
}

export default Bio
