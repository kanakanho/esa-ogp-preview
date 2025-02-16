import type { MetaData } from '.'

type Props = {
  metaData: MetaData
  imageBuffer: string
  width: number
}

function CardSVG({ metaData, imageBuffer, width }: Props) {
  const imageWidth = width * 1.68 + (width - 700) / 10 * 3
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width={`${width}px`} height="126px" viewBox={`0 0 ${width} 126`}>
      <text x="12" y="50" font-size="20px">{metaData.title}</text>
      <text x="12" y="80" font-size="12px">{metaData.description}</text>
      <text x="12" y="100" font-size="12px">{metaData.url}</text>
      {metaData.image.length !== 0
        ? (
            <>
              <clipPath id="clip">
                <rect x="0" y="0" width={`${imageWidth}px`} height="126px" rx="10" />
              </clipPath>
              <image x="0" y="0" width={`${imageWidth}px`} height="126px" xlink:href={`data:image/+svg;base64,${imageBuffer}`} clip-path="url(#clip)" />
            </>
          )
        : (
            <rect x={width - 126} y="0" width={`${width}px`} height="126px" fill="#fff" fill-opacity="0" rx="10" />
          )}
    </svg>
  )
}

export default CardSVG
