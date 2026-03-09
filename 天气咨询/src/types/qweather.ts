/**
 * 和风天气 API 类型定义
 * 文档: https://dev.qweather.com/docs/api/
 */

/**
 * API 基础响应结构
 */
export interface QWeatherBaseResponse {
  /** 状态码，请参考 https://dev.qweather.com/docs/resource/status-code/ */
  code: string
  /** 原始数据来源，或数据源说明，可能为空 */
  refer?: {
    sources?: string[]
    license?: string[]
  }
}

/**
 * 实时天气响应
 * API: /v7/weather/now
 * 文档: https://dev.qweather.com/docs/api/weather/weather-now/
 */
export interface WeatherNowResponse extends QWeatherBaseResponse {
  /** 当前 API 的最近更新时间 */
  updateTime: string
  /** 当前数据的响应式页面，便于嵌入网站或应用 */
  fxLink: string
  /** 实时天气数据 */
  now: WeatherNow
}

/**
 * 实时天气数据
 */
export interface WeatherNow {
  /** 数据观测时间 */
  obsTime: string
  /** 温度，默认单位：摄氏度 */
  temp: string
  /** 体感温度，默认单位：摄氏度 */
  feelsLike: string
  /** 天气状况的图标代码，参考 https://dev.qweather.com/docs/resource/icons/ */
  icon: string
  /** 天气状况的文字描述，包括阴晴雨雪等天气状态的描述 */
  text: string
  /** 风向 360 角度 */
  wind360: string
  /** 风向，如：东南风 */
  windDir: string
  /** 风力等级 */
  windScale: string
  /** 风速，公里/小时 */
  windSpeed: string
  /** 相对湿度，百分比数值 */
  humidity: string
  /** 过去1小时降水量，默认单位：毫米 */
  precip: string
  /** 大气压强，默认单位：百帕 */
  pressure: string
  /** 能见度，默认单位：公里 */
  vis: string
  /** 云量，百分比数值。可能为空 */
  cloud?: string
  /** 露点温度。可能为空 */
  dew?: string
}

/**
 * 热门城市响应
 * API: /geo/v2/city/top
 * 文档: https://dev.qweather.com/docs/api/geoapi/top-city/
 */
export interface TopCityResponse extends QWeatherBaseResponse {
  /** 热门城市列表 */
  topCityList: TopCity[]
}

/**
 * 城市搜索响应
 * API: /geo/v2/city/lookup
 * 文档: https://dev.qweather.com/docs/api/geoapi/city-lookup/
 */
export interface CityLookupResponse extends QWeatherBaseResponse {
  /** 搜索到的地区/城市列表 */
  location: Location[]
}

/**
 * 地区/城市数据
 */
export interface Location {
  /** 地区/城市名称 */
  name: string
  /** 地区/城市 ID */
  id: string
  /** 地区/城市纬度 */
  lat: string
  /** 地区/城市经度 */
  lon: string
  /** 地区/城市的上级行政区划名称 */
  adm2: string
  /** 地区/城市所属一级行政区域 */
  adm1: string
  /** 地区/城市所属国家名称 */
  country: string
  /** 地区/城市所在时区 */
  tz: string
  /** 地区/城市目前与 UTC 时间偏移的小时数 */
  utcOffset: string
  /** 地区/城市是否当前处于夏令时。1 表示当前处于夏令时，0 表示当前不是夏令时 */
  isDst: string
  /** 地区/城市的属性 */
  type: string
  /** 地区评分 */
  rank: string
  /** 该地区的天气预报网页链接，便于嵌入你的网站或应用 */
  fxLink: string
}

/**
 * 热门城市数据
 */
export interface TopCity {
  /** 地区/城市名称 */
  name: string
  /** 地区/城市 ID */
  id: string
  /** 地区/城市纬度 */
  lat: string
  /** 地区/城市经度 */
  lon: string
  /** 地区/城市的上级行政区划名称 */
  adm2: string
  /** 地区/城市所属一级行政区域 */
  adm1: string
  /** 地区/城市所属国家名称 */
  country: string
  /** 地区/城市所在时区 */
  tz: string
  /** 地区/城市目前与 UTC 时间偏移的小时数 */
  utcOffset: string
  /** 地区/城市是否当前处于夏令时。1 表示当前处于夏令时，0 表示当前不是夏令时 */
  isDst: string
  /** 地区/城市的属性 */
  type: string
  /** 地区评分 */
  rank: string
  /** 该地区的天气预报网页链接，便于嵌入你的网站或应用 */
  fxLink: string
}

/**
 * 用户位置数据
 */
export interface UserLocation {
  /** 纬度 */
  lat: number
  /** 经度 */
  lon: number
}