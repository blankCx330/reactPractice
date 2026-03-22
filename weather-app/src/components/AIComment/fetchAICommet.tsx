import type { AICommentRequest } from "@/types/qweather";

const buildPrompt = (params : AICommentRequest) => {
    const {city, weather, nowTemp, maxTemp, minTemp, precip, humidity, uvIndex, vis, windDirDay, windScaleDay, windDirNight, windScaleNight} = params
    return `${city}今日天气情况：
            - 天气状况：${weather}
            - 当前温度：${nowTemp}°C
            - 今日最高温度：${maxTemp}°C
            - 今日最低温度：${minTemp}°C
            - 相对湿度：${humidity}%
            - 降水量：${precip}毫米
            - 白天风向：${windDirDay}
            - 白天风力：${windScaleDay}公里/小时
            - 夜间风向：${windDirNight}
            - 夜间风力：${windScaleNight}公里/小时
            - 能见度：${vis}公里
            - 紫外线指数：${uvIndex}

            请作为专业的天气分析师，给出以下建议（简洁明了，每项2-3句话）：
            1. 穿衣建议
            2. 出行建议
            3. 运动/户外活动建议
            4. 温馨提示

            请直接输出建议内容，不要有开场白。`
}

export async function fetchAICommet(params:AICommentRequest):Promise<Response> {
    const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (!deepseekApiKey) {
        throw new Error('DeepSeek API Key 未配置，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY')
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${deepseekApiKey}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content:
                        '你是一位专业的天气分析师，擅长根据天气数据给出实用的生活建议。你的回答简洁、专业、有温度。语气要柔和，不要过于机械，但同时又不能失去专业的建议'
                },
                {
                    role: 'user',
                    content: buildPrompt(params),
                },
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 500,
        })
    })

    if(!response.ok){
        const err = await response.json().catch(()=>({}))
        throw new Error(err.error?.messages || `API 请求失败: ${response.status}`);//response.status返回失败代码
    }

    return response
}