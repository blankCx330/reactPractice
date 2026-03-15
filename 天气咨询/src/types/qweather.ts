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
  lat: number
  /** 地区/城市经度 */
  lon: number
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

/**
 * POI搜索响应
 * API: /geo/v2/poi/lookup
 * 文档: https://dev.qweather.com/docs/api/geoapi/poi-lookup/
 */
export interface PoiLookupResponse extends QWeatherBaseResponse {
  /** POI（兴趣点）列表 */
  poi: Poi[]
}

/**
 * POI（兴趣点）数据
 */
export interface Poi {
  /** POI名称 */
  name: string
  /** POI ID */
  id: string
  /** POI纬度 */
  lat: number
  /** POI经度 */
  lon: number
  /** POI的上级行政区划名称 */
  adm2: string
  /** POI所属一级行政区域 */
  adm1: string
  /** POI所属国家名称 */
  country: string
  /** POI所在时区 */
  tz: string
  /** POI目前与UTC时间偏移的小时数 */
  utcOffset: string
  /** POI是否当前处于夏令时。1表示当前处于夏令时，0表示当前不是夏令时 */
  isDst: string
  /** POI的属性 */
  type: string
  /** 地区评分 */
  rank: string
  /** 该地区的天气预报网页链接，便于嵌入你的网站或应用 */
  fxLink: string
}

/**
 * 每日天气预报响应
 * API: /v7/weather/7d
 * 文档: https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
 */
export interface WeatherDailyResponse extends QWeatherBaseResponse {
  /** 当前 API 的最近更新时间 */
  updateTime: string
  /** 当前数据的响应式页面，便于嵌入网站或应用 */
  fxLink: string
  /** 每日天气预报数据 */
  daily: WeatherDaily[]
}

/**
 * 每日天气预报数据
 */
export interface WeatherDaily {
  /** 预报日期 */
  fxDate: string
  /** 日出时间，在高纬度地区可能为空 */
  sunrise?: string
  /** 日落时间，在高纬度地区可能为空 */
  sunset?: string
  /** 当天月升时间，可能为空 */
  moonrise?: string
  /** 当天月落时间，可能为空 */
  moonset?: string
  /** 月相名称 */
  moonPhase: string
  /** 月相图标代码 */
  moonPhaseIcon: string
  /** 预报当天最高温度 */
  tempMax: string
  /** 预报当天最低温度 */
  tempMin: string
  /** 预报白天天气状况的图标代码 */
  iconDay: string
  /** 预报白天天气状况文字描述 */
  textDay: string
  /** 预报夜间天气状况的图标代码 */
  iconNight: string
  /** 预报晚间天气状况文字描述 */
  textNight: string
  /** 预报白天风向360角度 */
  wind360Day: string
  /** 预报白天风向 */
  windDirDay: string
  /** 预报白天风力等级 */
  windScaleDay: string
  /** 预报白天风速，公里/小时 */
  windSpeedDay: string
  /** 预报夜间风向360角度 */
  wind360Night: string
  /** 预报夜间风向 */
  windDirNight: string
  /** 预报夜间风力等级 */
  windScaleNight: string
  /** 预报夜间风速，公里/小时 */
  windSpeedNight: string
  /** 相对湿度，百分比数值 */
  humidity: string
  /** 预报当天总降水量，默认单位：毫米 */
  precip: string
  /** 大气压强，默认单位：百帕 */
  pressure: string
  /** 能见度，默认单位：公里 */
  vis: string
  /** 云量，百分比数值，可能为空 */
  cloud?: string
  /** 紫外线强度指数 */
  uvIndex: string
}

/**
 * 格点逐小时天气预报响应
 * API: /v7/grid-weather/24h
 * 文档: https://dev.qweather.com/docs/api/weather/grid-weather-hourly-forecast/
 */
export interface GridWeatherHourlyResponse extends QWeatherBaseResponse {
  /** 当前 API 的最近更新时间 */
  updateTime: string
  /** 当前数据的响应式页面，便于嵌入网站或应用 */
  fxLink: string
  /** 格点逐小时天气预报数据 */
  hourly: GridWeatherHourly[]
}

/**
 * 格点逐小时天气预报数据
 */
export interface GridWeatherHourly {
  /** 预报时间 */
  fxTime: string
  /** 温度，默认单位：摄氏度 */
  temp: string
  /** 天气状况的图标代码 */
  icon: string
  /** 天气状况的文字描述 */
  text: string
  /** 风向360角度 */
  wind360: string
  /** 风向 */
  windDir: string
  /** 风力等级 */
  windScale: string
  /** 风速，公里/小时 */
  windSpeed: string
  /** 相对湿度，百分比数值 */
  humidity: string
  /** 当前小时累计降水量，默认单位：毫米 */
  precip: string
  /** 大气压强，默认单位：百帕 */
  pressure: string
  /** 云量，百分比数值，可能为空 */
  cloud?: string
  /** 露点温度，可能为空 */
  dew?: string
}

/**
 * 实时空气质量响应
 * API: /airquality/v1/current/{lat}/{lon}
 * 文档: https://dev.qweather.com/docs/api/air-quality/air-current/
 */
export interface AirQualityCurrentResponse {
  /** 元数据 */
  metadata: AirQualityMetadata
  /** 空气质量指数数组 */
  indexes: AirQualityIndex[]
  /** 污染物数组 */
  pollutants: AirPollutant[]
  /** 监测站数组，可能为空 */
  stations?: AirQualityStation[]
}

/**
 * 空气质量元数据
 */
export interface AirQualityMetadata {
  /** 数据标签 */
  tag: string
}

/**
 * 空气质量指数
 */
export interface AirQualityIndex {
  /** 空气质量指数Code，参考 https://dev.qweather.com/docs/resource/air-info/#supported-aqis */
  code: string
  /** 空气质量指数的名字 */
  name: string
  /** 空气质量指数的值 */
  aqi: number
  /** 空气质量指数的值的文本显示 */
  aqiDisplay: string
  /** 空气质量指数等级，可能为空 */
  level?: string
  /** 空气质量指数类别，可能为空 */
  category?: string
  /** 空气质量指数的颜色 */
  color: AirQualityColor
  /** 首要污染物，可能为空 */
  primaryPollutant?: AirQualityPrimaryPollutant
  /** 健康建议，可能为空 */
  health?: AirQualityHealth
}

/**
 * 空气质量颜色 (RGBA)
 */
export interface AirQualityColor {
  /** 红色分量 */
  red: number
  /** 绿色分量 */
  green: number
  /** 蓝色分量 */
  blue: number
  /** 透明度 */
  alpha: number
}

/**
 * 首要污染物
 */
export interface AirQualityPrimaryPollutant {
  /** 首要污染物的Code */
  code: string
  /** 首要污染物的名字 */
  name: string
  /** 首要污染物的全称 */
  fullName: string
}

/**
 * 健康建议
 */
export interface AirQualityHealth {
  /** 空气质量对健康的影响 */
  effect?: string
  /** 健康指导意见 */
  advice?: {
    /** 对一般人群的健康指导意见 */
    generalPopulation?: string
    /** 对敏感人群的健康指导意见 */
    sensitivePopulation?: string
  }
}

/**
 * 污染物
 */
export interface AirPollutant {
  /** 污染物的Code */
  code: string
  /** 污染物的名字 */
  name: string
  /** 污染物的全称 */
  fullName: string
  /** 污染物的浓度 */
  concentration: AirPollutantConcentration
  /** 污染物的分指数数组，可能为空 */
  subIndexes?: AirPollutantSubIndex[]
}

/**
 * 污染物浓度
 */
export interface AirPollutantConcentration {
  /** 污染物的浓度值 */
  value: number
  /** 污染物的浓度值的单位 */
  unit: string
}

/**
 * 污染物分指数
 */
export interface AirPollutantSubIndex {
  /** 污染物的分指数的Code */
  code: string
  /** 污染物的分指数的数值 */
  aqi: number
  /** 污染物的分指数数值的显示名称 */
  aqiDisplay: string
}

/**
 * 空气质量监测站
 */
export interface AirQualityStation {
  /** 监测站Location ID */
  id: string
  /** 监测站名称 */
  name: string
}

/**
 * query传递的数据
 */
export interface QueryState {
  isLoading: boolean
  isError: boolean
  error: Error
}
