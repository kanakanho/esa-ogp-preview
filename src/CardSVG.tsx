import type { MetaData } from '.'

type Props = {
  metaData: MetaData
  imageBuffer: string
}

function CardSVG({ metaData, imageBuffer }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="700px" height="126px" viewBox="0 0 700 126">
      <text x="12" y="50" font-size="20px">{metaData.title}</text>
      <text x="12" y="80" font-size="12px">{metaData.description}</text>
      <text x="12" y="100" font-size="12px">{metaData.url}</text>
      {metaData.image.length !== 0
        ? (
            <>
              <clipPath id="clip">
                <rect x="0" y="0" width="1170px" height="126px" rx="10" />
              </clipPath>
              <image x="0" y="0" width="1170px" height="126px" xlink:href={`data:image/+svg;base64,${imageBuffer}`} clip-path="url(#clip)" />
            </>
          )
        : (
            <rect x="0" y="0" width="1170px" height="126px" fill="#f0f0f0" rx="10" />
          )}
    </svg>
  )
}

export default CardSVG
