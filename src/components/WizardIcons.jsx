import React from 'react'
import {
  Square, LayoutGrid, Share2, Menu, Type, Blinds, ChevronsRight,
  ChevronsUpDown, Sparkles, Film, PlayCircle, Puzzle, MapPin,
  Shapes, List, Package, Maximize, PanelTop, ChevronDown,
  Asterisk, LayoutDashboard, GitBranch, Pin,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Eye, EyeOff, Move, RotateCcw, RotateCw, PinOff
} from 'lucide-react'

const sz = { width: '100%', height: '100%' }

/* ── Wix Studio inline SVGs (extracted from downloaded assets) ── */

function WixSection(props) {
  return (
    <svg viewBox="34 5 26 20" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M57 5H37a1 1 0 1 0 0 2h20a1 1 0 1 0 0-2" />
      <path d="M36 10.714v8.572l22-.002v-8.57zM58 21H36c-1.103 0-2-.598-2-1.333v-9.334C34 9.598 34.897 9 36 9h22c1.103 0 2 .598 2 1.333v9.334c0 .735-.897 1.333-2 1.333" fillRule="evenodd" clipRule="evenodd" />
      <path d="M36 23h22a1 1 0 1 1 0 2H36a1 1 0 1 1 0-2" />
    </svg>
  )
}

function WixBox(props) {
  return (
    <svg viewBox="34 6 26 18" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M36 8v14.002L58 22V8zm22 16H36c-1.103 0-2-.897-2-2V8c0-1.103.897-2 2-2h22c1.103 0 2 .897 2 2v14c0 1.103-.897 2-2 2" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixCell(props) {
  return (
    <svg viewBox="36 4 23 23" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M38 6v6.002L44 12V6h-6Zm6 8h-6c-1.103 0-2-.897-2-2V6c0-1.103.897-2 2-2h6c1.103 0 2 .897 2 2v6c0 1.103-.897 2-2 2Zm11-8h2v2h2V6c0-1.103-.897-2-2-2h-2v2Zm-4 0v2h-2V6c0-1.103.897-2 2-2h2v2h-2Zm2 6.001-2 .001V10h-2v2c0 1.103.897 2 2 2h2v-1.999ZM57 12v-2h2v2c0 1.103-.897 2-2 2h-2v-1.999L57 12Zm-19 7h2v-2h-2c-1.103 0-2 .897-2 2v2h2v-2Zm6 0h-2v-2h2c1.103 0 2 .897 2 2v2h-2v-2Zm-4 6.001-2 .001V23h-2v2c0 1.103.897 2 2 2h2v-1.999ZM44 25v-2h2v2c0 1.103-.897 2-2 2h-2v-1.999L44 25Z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixButton(props) {
  return (
    <svg viewBox="32 8 30 14" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M34 15c0-2.757 2.243-5 5-5h16c2.757 0 5 2.243 5 5s-2.243 5-5 5H39c-2.757 0-5-2.243-5-5m5 7h16c3.859 0 7-3.141 7-7s-3.141-7-7-7H39c-3.859 0-7 3.141-7 7s3.141 7 7 7m15-6H40v-2h14z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixText(props) {
  return (
    <svg viewBox="37 5 20 20" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M37 7v3h2V7h7v16h-3v2h8v-2h-3V7h7v3h2V7a2 2 0 0 0-2-2H39a2 2 0 0 0-2 2" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixTextParagraph(props) {
  return (
    <svg viewBox="36 7 22 14" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M36 9h22V7H36z" fillRule="evenodd" clipRule="evenodd" />
      <path d="M36 13h14v-2H36z" fillRule="evenodd" clipRule="evenodd" />
      <path d="M36 17h22v-2H36z" fillRule="evenodd" clipRule="evenodd" />
      <path d="M36 21h14v-2H36z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixImage(props) {
  return (
    <svg viewBox="36 4 22 22" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M38 24h18V6H38v18Zm18 2H38c-1.103 0-2-.897-2-2V6c0-1.103.897-2 2-2h18c1.103 0 2 .897 2 2v18c0 1.103-.897 2-2 2ZM51 9c1.104 0 2 .894 2 1.995a1.997 1.997 0 0 1-2 1.995c-1.104 0-2-.892-2-1.995C49 9.894 49.896 9 51 9Zm-2.335 9.798 1.495-1.786L53.5 21h-13l5-6 3.165 3.798Z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixVideo(props) {
  return (
    <svg viewBox="35 3 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M37 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10-10-4.486-10-10m-2 0c0 6.617 5.383 12 12 12s12-5.383 12-12S53.617 3 47 3 35 8.383 35 15m10-4 5.914 3.941a.07.07 0 0 1 0 .115L45 19z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixVideoEmbed(props) {
  return (
    <svg viewBox="34 2 27 27" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M36 14c0-5.51 4.49-10 10-10 5.17 0 9.45 3.96 9.95 9h2.01C57.45 6.85 52.28 2 46 2c-6.62 0-12 5.38-12 12 0 6.28 4.85 11.45 11 11.96v-2.01c-5.04-.5-9-4.78-9-9.95m8 4 5.914-3.943a.07.07 0 0 0 0-.116L44 10zm8.519-1.571c1.935-1.905 5.087-1.907 7.024 0A4.85 4.85 0 0 1 61 19.908a4.85 4.85 0 0 1-1.458 3.479l-1.274 1.255-1.404-1.425 1.276-1.256c.554-.546.86-1.275.86-2.053s-.306-1.507-.86-2.053a3.015 3.015 0 0 0-4.218 0l-1.277 1.254-1.402-1.427zm1.56 9.717a3.017 3.017 0 0 1-4.219 0A2.86 2.86 0 0 1 49 24.09c0-.777.306-1.507.86-2.052l1.276-1.256-1.404-1.425-1.274 1.255A4.84 4.84 0 0 0 47 24.092a4.85 4.85 0 0 0 1.457 3.48A5 5 0 0 0 51.97 29a5 5 0 0 0 3.511-1.428l1.276-1.253-1.402-1.427zm-1.195-1.55-1.403-1.425 3.872-3.813 1.403 1.425z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixEmbed(props) {
  return (
    <svg viewBox="33 4 28 22" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m45.186 26-1.936-.501L48.814 4l1.936.502L45.186 26ZM60.73 14.315 54.83 8l-1.46 1.37L58.63 15l-5.26 5.629 1.46 1.37 5.9-6.314c.36-.385.36-.985 0-1.37ZM39.139 8l-5.87 6.316a1.003 1.003 0 0 0 0 1.368L39.139 22l1.463-1.367L35.368 15l5.234-5.633L39.139 8Z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixShape(props) {
  return (
    <svg viewBox="35 3 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M35 9.5C35 5.9 37.9 3 41.5 3c2.3 0 4.3 1.2 5.5 3 1.2-1.8 3.2-3 5.5-3C56.1 3 59 5.9 59 9.5c0 2.3-1.2 4.3-3 5.5 1.8 1.2 3 3.2 3 5.5 0 3.6-2.9 6.5-6.5 6.5-2.3 0-4.3-1.2-5.5-3-1.2 1.8-3.2 3-5.5 3-3.6 0-6.5-2.9-6.5-6.5 0-2.3 1.2-4.3 3-5.5-1.8-1.2-3-3.2-3-5.5m18.5 6.6c-.5-.1-1-.6-1-1.1 0-.6.5-1 1-1.1 2-.5 3.5-2.2 3.5-4.4C57 7 55 5 52.5 5c-2.1 0-3.9 1.5-4.4 3.5-.1.5-.6 1-1.1 1-.6 0-1-.5-1.1-1-.5-2-2.2-3.5-4.4-3.5C39 5 37 7 37 9.5c0 2.1 1.5 3.9 3.5 4.4.5.1 1 .6 1 1.1 0 .6-.5 1-1 1.1-2 .5-3.5 2.2-3.5 4.4 0 2.5 2 4.5 4.5 4.5 2.1 0 3.9-1.5 4.4-3.5.1-.5.6-1 1.1-1 .6 0 1 .5 1.1 1 .5 2 2.2 3.5 4.4 3.5 2.5 0 4.5-2 4.5-4.5 0-2.1-1.5-3.9-3.5-4.4" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixHLine(props) {
  return (
    <svg viewBox="34 11 26 8" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M56 13v1H38v-1h-4v4h4v-1h18v1h4v-4h-4Z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixVLine(props) {
  return (
    <svg viewBox="43 2 8 26" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M45 6h1v18h-1v4h4v-4h-1V6h1V2h-4v4Z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixLightbox(props) {
  return (
    <svg viewBox="33 5 28 20" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M59 21h-2V9h2zm-4 2H39V7h16zm-18-2h-2V9h2zM57 7h2c1.103 0 2 .897 2 2v12c0 1.103-.897 2-2 2h-2c0 1.103-.897 2-2 2H39c-1.103 0-2-.897-2-2h-2c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2h2c0-1.103.897-2 2-2h16c1.103 0 2 .897 2 2m-6.5 6.993c.828 0 1.5-.67 1.5-1.497C52 11.67 51.328 11 50.5 11c-.829 0-1.5.67-1.5 1.496 0 .827.671 1.497 1.5 1.497m-.867 2.683-1.246 1.49L45.75 15l-4.166 5h10.833z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixTabs(props) {
  return (
    <svg viewBox="33 4 28 22" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M40 24h19V10h-2v2c0 1.103-.897 2-2 2H40zm15-12H35V6h20zm2-4h2c1.103 0 2 .897 2 2v14c0 1.103-.897 2-2 2H40c-1.103 0-2-.897-2-2V14h-3c-1.103 0-2-.897-2-2V6c0-1.103.897-2 2-2h20c1.103 0 2 .897 2 2zm-4 2h-4V8h4zm-10 0h4V8h-4zm-2 0h-4V8h4z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function WixTable(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.5 5h-11A1.502 1.502 0 0 0 5 6.5v10A1.502 1.502 0 0 0 6.5 18h11a1.502 1.502 0 0 0 1.5-1.5v-10A1.502 1.502 0 0 0 17.5 5Zm.5 1.5V9h-8V6h7.5a.5.5 0 0 1 .5.5ZM10 10h8v3h-8v-3Zm-1 3H6v-3h3v3ZM6.5 6H9v3H6V6.5a.5.5 0 0 1 .5-.5ZM6 16.5V14h3v3H6.5a.5.5 0 0 1-.5-.5Zm11.5.5H10v-3h8v2.5a.501.501 0 0 1-.5.5Z" />
    </svg>
  )
}

function WixLayers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.993 19.998a1.5 1.5 0 0 1-.835-.255L4.444 15.25a1 1 0 0 1 .008-1.667l1.694-1.114-1.693-1.107a1 1 0 0 1 .006-1.678l6.919-4.446a1.5 1.5 0 0 1 1.653.02l6.53 4.428a1 1 0 0 1-.014 1.665L17.9 12.427l1.67 1.159a1 1 0 0 1-.013 1.652l-6.73 4.505a1.5 1.5 0 0 1-.835.255ZM7.06 13.066 5 14.419l6.714 4.493a.498.498 0 0 0 .556 0L19 14.407l-2.003-1.39-4.186 2.738a1.5 1.5 0 0 1-1.641 0l-4.112-2.689ZM12.189 6a.503.503 0 0 0-.271.08L5 10.525l6.718 4.393a.502.502 0 0 0 .548 0L19 10.514l-6.53-4.427A.5.5 0 0 0 12.19 6Z" />
    </svg>
  )
}

function WixRepeat(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.986 7.003h5.077l-2.319-2.287.701-.712 3.551 3.5-3.55 3.492-.7-.713 2.316-2.28h-5.076a5 5 0 1 0 0 10L13.998 18 14 19l-2.015.003a6 6 0 1 1 0-12Z" />
    </svg>
  )
}

function WixImage24(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18,14.123 L14.355,9.577 C14.266,9.466 14.135,9.398 13.992,9.391 C13.854,9.374 13.713,9.435 13.612,9.535 L9.349,13.777 L7.633,12.605 C7.45,12.482 7.207,12.49 7.035,12.63 L5,14.282 L5,6.5 C5,6.224 5.225,6 5.5,6 L17.5,6 C17.775,6 18,6.224 18,6.5 L18,14.123 Z M18,17.5 C18,17.776 17.775,18 17.5,18 L5.5,18 C5.225,18 5,17.776 5,17.5 L5,15.57 L7.377,13.642 L9.126,14.837 C9.324,14.973 9.59,14.948 9.761,14.778 L13.923,10.637 L18,15.721 L18,17.5 Z M17.5,5 L5.5,5 C4.673,5 4,5.673 4,6.5 L4,17.5 C4,18.327 4.673,19 5.5,19 L17.5,19 C18.327,19 19,18.327 19,17.5 L19,6.5 C19,5.673 18.327,5 17.5,5 L17.5,5 Z M8,8 C7.447,8 7,8.448 7,9 C7,9.552 7.447,10 8,10 C8.553,10 9,9.552 9,9 C9,8.448 8.553,8 8,8 L8,8 Z" />
    </svg>
  )
}

function WixSitemap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#sm)"><path d="M10 4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v2H8a1 1 0 0 0-1 1v2H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H8v-2h7v2h-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-1v-2a1 1 0 0 0-1-1h-3V9h1a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3Zm3 1v3h-3V5h3Zm4 10v3h-3v-3h3ZM6 15h3v3H6v-3Z" /></g><defs><clipPath id="sm"><path d="M0 0h24v24H0z" /></clipPath></defs>
    </svg>
  )
}

function WixGrid(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.75 5h-3.5c-.33 0-.65.13-.88.37-.23.24-.37.55-.37.88v3.5c0 .33.13.65.37.88.23.23.55.37.88.37h3.5c.33 0 .65-.13.88-.37.23-.24.37-.55.37-.88v-3.5c0-.33-.13-.65-.37-.88-.23-.23-.55-.37-.88-.37ZM18 9.75c0 .07-.03.13-.07.18-.05.05-.11.07-.18.07h-3.5c-.07 0-.13-.03-.18-.07a.241.241 0 0 1-.07-.18v-3.5c0-.07.03-.13.07-.18.05-.05.11-.07.18-.07h3.5c.07 0 .13.03.18.07.05.05.07.11.07.18v3.5ZM9.75 5h-3.5c-.33 0-.65.13-.88.37-.23.24-.37.55-.37.88v3.5c0 .33.13.65.37.88.23.23.55.37.88.37h3.5c.33 0 .65-.13.88-.37.23-.24.37-.55.37-.88v-3.5c0-.33-.13-.65-.37-.88-.23-.23-.55-.37-.88-.37ZM10 9.75c0 .07-.03.13-.07.18-.05.05-.11.07-.18.07h-3.5c-.07 0-.13-.03-.18-.07A.241.241 0 0 1 6 9.75v-3.5c0-.07.03-.13.07-.18.05-.05.11-.07.18-.07h3.5c.07 0 .13.03.18.07.05.05.07.11.07.18v3.5ZM17.75 13h-3.5c-.33 0-.65.13-.88.37-.23.24-.37.55-.37.88v3.5c0 .33.13.65.37.88.23.23.55.37.88.37h3.5c.33 0 .65-.13.88-.37.23-.24.37-.55.37-.88v-3.5c0-.33-.13-.65-.37-.88-.23-.23-.55-.37-.88-.37Zm.25 4.75c0 .07-.03.13-.07.18-.05.05-.11.07-.18.07h-3.5c-.07 0-.13-.03-.18-.07a.241.241 0 0 1-.07-.18v-3.5c0-.07.03-.13.07-.18.05-.05.11-.07.18-.07h3.5c.07 0 .13.03.18.07.05.05.07.11.07.18v3.5ZM9.75 13h-3.5c-.33 0-.65.13-.88.37-.23.24-.37.55-.37.88v3.5c0 .33.13.65.37.88.23.23.55.37.88.37h3.5c.33 0 .65-.13.88-.37.23-.24.37-.55.37-.88v-3.5c0-.33-.13-.65-.37-.88-.23-.23-.55-.37-.88-.37Zm.25 4.75c0 .07-.03.13-.07.18-.05.05-.11.07-.18.07h-3.5c-.07 0-.13-.03-.18-.07a.241.241 0 0 1-.07-.18v-3.5c0-.07.03-.13.07-.18.05-.05.11-.07.18-.07h3.5c.07 0 .13.03.18.07.05.05.07.11.07.18v3.5Z" />
    </svg>
  )
}

function WixCurlyBraces(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18.714 11.267a2.5 2.5 0 0 0 1.768.732v1a2.5 2.5 0 0 0-2.5 2.501v3a1.5 1.5 0 0 1-1.5 1.5H15v-1h1.482a.5.5 0 0 0 .5-.5v-3a3.5 3.5 0 0 1 1.698-3 3.5 3.5 0 0 1-1.698-3v-3a.5.5 0 0 0-.5-.5H15V5h1.482a1.5 1.5 0 0 1 1.5 1.5v3a2.5 2.5 0 0 0 .732 1.767ZM5.302 12.5A3.502 3.502 0 0 1 7 15.5v3a.5.5 0 0 0 .5.5h1.482v1H7.5A1.5 1.5 0 0 1 6 18.5v-3A2.5 2.5 0 0 0 3.5 13v-1A2.5 2.5 0 0 0 6 9.5v-3A1.5 1.5 0 0 1 7.5 5h1.482v1H7.5a.5.5 0 0 0-.5.5v3a3.5 3.5 0 0 1-1.698 3Z" />
    </svg>
  )
}

/* ── Lucide wrapper for consistent sizing ── */
function LucideIcon({ icon: Icon, ...rest }) {
  return <Icon size="100%" strokeWidth={1.5} {...rest} />
}

/* ── Master icon map ── */
const ICON_COMPONENTS = {
  'Section':              WixSection,
  'Box':                  WixBox,
  'Cell':                 WixCell,
  'Easy Grid':            WixGrid,
  'Button':               WixButton,
  'Social Bar':           (p) => <LucideIcon icon={Share2} {...p} />,
  'Hamburger Menu':       (p) => <LucideIcon icon={Menu} {...p} />,
  'Text':                 WixText,
  'Text Mask':            (p) => <LucideIcon icon={Type} {...p} />,
  'Text Marquee':         WixTextParagraph,
  'Collapsible Text':     (p) => <LucideIcon icon={ChevronsUpDown} {...p} />,
  'Image':                WixImage,
  'Video Box':            WixVideo,
  'Lottie Animation':     (p) => <LucideIcon icon={Sparkles} {...p} />,
  'Transparent Video':    (p) => <LucideIcon icon={Film} {...p} />,
  'Single Video Player':  (p) => <LucideIcon icon={PlayCircle} {...p} />,
  'Custom Element':       (p) => <LucideIcon icon={Puzzle} {...p} />,
  'Embed':                WixEmbed,
  'Google Maps':          (p) => <LucideIcon icon={MapPin} {...p} />,
  'Shape':                WixShape,
  'Horizontal Line':      WixHLine,
  'Vertical Line':        WixVLine,
  'List Item':            (p) => <LucideIcon icon={List} {...p} />,
  'System Container':     (p) => <LucideIcon icon={Package} {...p} />,
  'Repeater':             WixRepeat,
  'Lightbox':             WixLightbox,
  'Tabs':                 WixTabs,
  'Accordion':            (p) => <LucideIcon icon={ChevronDown} {...p} />,
  'Any Element':          (p) => <LucideIcon icon={Asterisk} {...p} />,
  'Any Container':        (p) => <LucideIcon icon={LayoutDashboard} {...p} />,
  'Any Child Element':    (p) => <LucideIcon icon={GitBranch} {...p} />,
  'Any Pinned Element':   (p) => <LucideIcon icon={Pin} {...p} />
}

const FallbackIcon = (p) => <LucideIcon icon={Square} {...p} />

export function WizardIcon({ name, ...rest }) {
  const Comp = ICON_COMPONENTS[name] || FallbackIcon
  return <Comp {...rest} />
}

export const CONTEXT_ICON_MAP = {
  'Any Parent':                    (p) => <LucideIcon icon={Asterisk} {...p} />,
  'Section':                       WixSection,
  'Header':                        WixSection,
  'Box':                           WixBox,
  'Section > Easy Grid':           WixGrid,
  'Header | System Container':     (p) => <LucideIcon icon={Package} {...p} />,
  'Section | Footer':              WixSection
}

export function ContextIcon({ name, ...rest }) {
  const Comp = CONTEXT_ICON_MAP[name] || FallbackIcon
  return <Comp {...rest} />
}

export const CONDITION_ICON_MAP = {
  'Any':                                     (p) => <LucideIcon icon={Asterisk} {...p} />,
  'Is First':                                (p) => <LucideIcon icon={ChevronsRight} {...p} />,
  'Is Last':                                 (p) => <LucideIcon icon={ChevronsRight} {...p} />,
  'Desktop Width: 1px – 100px':              WixHLine,
  'Desktop Width: 101px – 200px':            WixHLine,
  'Desktop Width: 201px+':                   WixHLine,
  'Desktop Height: 1px – 100px':             WixVLine,
  'Desktop Height: 101px+':                  WixVLine,
  'Rotation = 0':                            (p) => <LucideIcon icon={Square} {...p} />,
  'Is Rotated (Value ≠ 0)':                  WixRepeat,
  'Rotation = 90/270 (±)':                   (p) => <LucideIcon icon={RotateCw} {...p} />,
  'Rotation = 180':                          (p) => <LucideIcon icon={RotateCcw} {...p} />,
  'All Descendant Text Style: Left':         (p) => <LucideIcon icon={AlignLeft} {...p} />,
  'All Descendant Text Style: Center':       (p) => <LucideIcon icon={AlignCenter} {...p} />,
  'All Descendant Text Style: Right':        (p) => <LucideIcon icon={AlignRight} {...p} />,
  'All Descendant Text Style: Mixed':        (p) => <LucideIcon icon={AlignJustify} {...p} />,
  'Is Visible':                              (p) => <LucideIcon icon={Eye} {...p} />,
  'Is Hidden':                               (p) => <LucideIcon icon={EyeOff} {...p} />,
  'Is Pinned':                               (p) => <LucideIcon icon={Pin} {...p} />,
  'Is Not Pinned':                           (p) => <LucideIcon icon={PinOff} {...p} />,
  'Has Padding':                             WixBox,
  'No Padding':                              (p) => <LucideIcon icon={Square} {...p} />,
  'Has Margin':                              (p) => <LucideIcon icon={Maximize} {...p} />,
  'No Margin':                               (p) => <LucideIcon icon={Square} {...p} />,
  'Blank':                                   (p) => <LucideIcon icon={Square} {...p} />,
  'Contains Elements':                       (p) => <LucideIcon icon={Package} {...p} />,
  'Component Above is Same Type':            (p) => <LucideIcon icon={GitBranch} {...p} />,
  'Component Above is Different Type':       (p) => <LucideIcon icon={GitBranch} {...p} />,
  'Is Logo Component':                       (p) => <LucideIcon icon={Shapes} {...p} />,
  'Is NOT Logo Component':                   (p) => <LucideIcon icon={Shapes} {...p} />
}

export function ConditionIcon({ name, ...rest }) {
  const Comp = CONDITION_ICON_MAP[name] || FallbackIcon
  return <Comp {...rest} />
}

export const ACTION_ICON_MAP = {
  'Set Size':       WixBox,
  'Set Min Height': WixVLine,
  'Set Margin':     (p) => <LucideIcon icon={Maximize} {...p} />,
  'Set Padding':    WixBox,
  'Set Alignment':  (p) => <LucideIcon icon={LayoutGrid} {...p} />,
  'Set Position':   (p) => <LucideIcon icon={Move} {...p} />,
  'Set Rotation':   WixRepeat,
  'Set Visibility': (p) => <WixEye {...p} />  ,
  'Set Spacing':    WixHLine,
  'Set Pinned':     (p) => <LucideIcon icon={Pin} {...p} />,
  'Set Font Size':  WixText,
  'Set OOG':        (p) => <LucideIcon icon={LayoutDashboard} {...p} />
}

function WixEye(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={sz} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20.81 11.27C19.77 9.38 16.79 5 11.5 5c-5.29 0-8.27 4.38-9.31 6.27-.12.22-.19.47-.19.73s.06.51.19.73C3.23 14.62 6.21 19 11.5 19c5.29 0 8.28-4.38 9.31-6.27.12-.22.19-.47.19-.73s-.06-.51-.19-.73Zm-.88.98C18.98 13.98 16.26 18 11.5 18s-7.48-4.02-8.44-5.75a.542.542 0 0 1 0-.5C4.01 10.02 6.73 6 11.49 6s7.48 4.02 8.44 5.75a.542.542 0 0 1 0 .5Zm-6.25-2.99c-.63-.5-1.42-.77-2.23-.76-.81.01-1.59.3-2.21.83-.62.52-1.04 1.24-1.18 2.04a3.503 3.503 0 0 0 2.15 3.89c.75.3 1.59.33 2.36.08a3.51 3.51 0 0 0 1.87-1.43c.44-.68.63-1.49.54-2.3a3.471 3.471 0 0 0-1.29-2.34l-.01-.01Zm-.23 4.3c-.36.45-.87.77-1.43.89-.57.12-1.16.04-1.67-.22-.51-.27-.92-.7-1.15-1.23-.23-.53-.27-1.13-.11-1.68a2.484 2.484 0 0 1 2.61-1.8c.58.05 1.12.3 1.53.7.42.4.68.94.74 1.51.04.33.01.66-.08.97-.09.32-.24.61-.45.87l.01-.01Z" />
    </svg>
  )
}

export function ActionIcon({ name, ...rest }) {
  const Comp = ACTION_ICON_MAP[name] || FallbackIcon
  return <Comp {...rest} />
}
