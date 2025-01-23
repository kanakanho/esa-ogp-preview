import type { FC } from 'hono/jsx'
import type { MetaData } from '.'
import { css } from 'hono/css'

type Props = {
  metaData: MetaData
}

const Card: FC<{ metaData: MetaData }> = ({ metaData }: Props) => {
  const cardA = css`
    text-decoration: none;
    color: black;
  `

  const cardDiv = css`
    display: flex;
    border-radius: 10px;
    background-color: white;
    justify-content: space-between;
    border: 1px solid #666;
  `

  const ogpImg = css`
    width: 240px;
    height: 126px;
    object-fit: cover;
    border-radius: 8px;
  `
  const noOgpImg = css`
    width: calc(240px - 40px);
    height: calc(126px - 40px);
    object-fit: cover;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    padding: 20px;
  `

  const textDiv = css`
    padding: 12px 24px;
    font-size: 0.9rem;

    p {
      margin: 0.2rem 0;
      height: 1.4rem;
    }
  `

  const titleH1 = css`
    font-size: 1.2rem;
    margin: 0.7rem 0 0.5rem 0;
  `

  const linkP = css`
    color: #666;
    font-size: 0.8rem;
  `

  return (
    <a class={cardA} href={metaData.url}>
      <div class={cardDiv}>
        <div class={textDiv}>
          <h1 class={titleH1}>{metaData.title}</h1>
          <p>{metaData.description}</p>
          <p class={linkP}>{metaData.url}</p>
        </div>
        <div>
          {
            metaData.image.length !== 0
              ? (
                  <img class={ogpImg} src={metaData.image} alt={metaData.title} />
                )
              : (
                  <div class={noOgpImg}>{metaData.title}</div>
                )
          }
        </div>
      </div>
    </a>
  )
}

export default Card
