import { useQuery } from '@tanstack/react-query'
const getPosition = () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持定位'))
      return
    }
    //先resolve(成功),再rejcet(拒绝),传入参数位置不能变
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true, // 高精度模式
      timeout: 300000, // 超时时间，单位毫秒
      maximumAge: 0, // 不使用缓存位置
    })
  })
}

export const useUserLocation = () => {
  return useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      const location = await getPosition()
      return { lon: location.coords.longitude, lat: location.coords.latitude }
    },
    staleTime: 5 * 60 * 1000, //5min内数据是新鲜的
    retry: 1, //重试1次
  })
}
