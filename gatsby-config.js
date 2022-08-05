require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const siteUrl = `https://memo.kkenya.com`;

module.exports = {
  siteMetadata: {
    title: `蛙のテックブログ`,
    description: `Web系ソフトウェアエンジニアの備忘録`,
    siteUrl,
    thumbnailUrl: `${siteUrl}/thumbnail.jpg`,
    articleDefaultImageUrl: `${siteUrl}/thumbnail.jpg`,
    articleDefaultImageSize: 740417,
    bio: {
      description: `Web系ソフトウェアエンジニアの備忘録`,
    },
  },
  plugins: [
    // image
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`, // Needed for dynamic images
    // filesystem
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    // markdown
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
        ],
      },
    },
    // tracking
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          process.env.GOOGLE_ANALYTICS_TRACKING_ID, // Google Analytics / GA
        ],
        pluginConfig: {
          head: true,
        },
      },
    },
    // RSS feed
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                thumbnailUrl
                articleDefaultImageUrl
                articleDefaultImageSize
                site_url: siteUrl
                image_url: thumbnailUrl
              }
            }
          }
        `,
        feeds: [
          {
            title: "KKenya TechBlog",
            output: "/rss.xml",
            query: `
              {
                allMarkdownRemark(
                  filter: { frontmatter: { status: { eq: "published" } } },
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                const { excerpt, fields, html, frontmatter } = edge.node
                const { title, date } = frontmatter
                const {
                  siteUrl,
                  articleDefaultImageUrl,
                  articleDefaultImageSize,
                } = site.siteMetadata
                const url = `${siteUrl}${fields.slug}`

                return {
                  title,
                  description: excerpt,
                  date,
                  url,
                  guid: url,
                  custom_elements: [{ "content:encoded": html }],
                  enclosure: {
                    url: articleDefaultImageUrl,
                    size: articleDefaultImageSize,
                  },
                }
              })
            },
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
  ],
}
