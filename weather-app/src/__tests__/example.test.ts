import {describe, it, expect} from 'vitest'

describe('基础测试示例', ()=> {
    it('1+1=2', ()=>{
        expect(1 + 1).toBe(2)
    })

    it('字符串里应该包含特定词语', ()=>{
        expect('天气咨询').toContain('天气')
    })

    it('数组包含特定元素', ()=>{
        const list = ['江门', '上海', '北京']
        expect(list).toContain('江门')
        expect(list).toHaveLength(3)
    })
})