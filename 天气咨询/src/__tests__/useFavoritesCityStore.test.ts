import { useFavoritesCityStore } from "../hooks/useFavoritesCityStore";
import { describe, it, expect, beforeEach } from "vitest"; 

describe("useFavoritesCityStore", ()=>{
    //在每个测试运行前调用，这是是为了每个测试前重置list
    beforeEach(()=>{
        useFavoritesCityStore.setState({list: []})
    })

    describe('addCity测试',()=>{
        it('添加城市列表测试', ()=>{
            //useFavoritesCityStore()	        React 组件中使用	❌ 需要 React 上下文
            //useFavoritesCityStore.getState()	任何地方直接访问	 ✅ 可以在测试中用
            //useFavoritesCityStore.setState()	直接修改状态	    ✅ 可以在测试中用
            const { addCity } = useFavoritesCityStore.getState()
            addCity({
                id: '10101',
                name: '江门name',
                adm2: '江门adm2',
                lon: '12.34567',
                lat: '21.65342',
            })
            const data = useFavoritesCityStore.getState().list

            expect(data).toHaveLength(1)
            expect(data[0].id).toBe('10101')
            expect(data[0].name).toBe('江门name')
            expect(data[0].adm2).toBe('江门adm2')
            expect(data[0].lon).toBe('12.34567')
            expect(data[0].lat).toBe('21.65342')
        })

        it('不应该添加同一个城市', ()=>{
            const { addCity } = useFavoritesCityStore.getState()
            addCity({
                id: '100',
                name: '江门name',
                adm2: '江门adm2',
                lon: '12.34567',
                lat: '21.65342',
            })
            addCity({
                id: '100',
                name: '江门name',
                adm2: '江门adm2',
                lon: '113.12345',
                lat: '22.56789',
            })
            const data = useFavoritesCityStore.getState().list
            expect(data).toHaveLength(1)
        })
    })
    
    describe('removeCity测试',()=>{
        it('移除功能测试', ()=>{
            const { addCity, removeCity } = useFavoritesCityStore.getState()
            addCity({
                    id: '1',
                    name: '1江门name',
                    adm2: '1江门adm2',
                    lon: '11.1234',
                    lat: '11.5678',
                })

            addCity({
                    id: '2',
                    name: '江门2',
                    adm2: '江门2',
                    lon: '22.12345',
                    lat: '22.6789',
                })
            
            addCity({
                    id: '3',
                    name: '江门3',
                    adm2: '江门3',
                    lon: '33.1234',
                    lat: '33.5678',
                })
            let list = useFavoritesCityStore.getState().list
            expect(list).toHaveLength(3)
            removeCity('2')
            list = useFavoritesCityStore.getState().list
            expect(list).toHaveLength(2)
            expect(list[0].name).toBe('1江门name')
            expect(list[1].name).toBe('江门3')
        })
    })

    describe('isInList', ()=>{
        it('判断是否存在列表测试', ()=>{
            const { addCity, isInList } = useFavoritesCityStore.getState()
            addCity({
                    id: '1',
                    name: '1江门name',
                    adm2: '1江门adm2',
                    lon: '1lon111',
                    lat: '1lat111',
                })

            addCity({
                    id: '2',
                    name: '江门2',
                    adm2: '江门2',
                    lon: '2lon111',
                    lat: '2lat111',
                })
            
            addCity({
                    id: '3',
                    name: '江门3',
                    adm2: '江门3',
                    lon: '3lon111',
                    lat: '3lat111',
                })
                
            expect(isInList('2')).toBe(true)
            expect(isInList('5')).toBe(false)
        })
    })

    describe('边界情况测试', ()=>{
        it('删除不存在的城市不应该报错', ()=>{
            const { removeCity } = useFavoritesCityStore.getState()
            expect(() => removeCity('不存在捏')).not.toThrow()
            expect(useFavoritesCityStore.getState().list).toHaveLength(0)
        })

        it('空列表时候isInList应返回false', ()=>{
            const { isInList } = useFavoritesCityStore.getState()
            expect(isInList('1')).toBe(false)
        })
    })

    describe('持久化测试', ()=>{
        it('数据应持久化到 localStorage', ()=>{
            const { addCity } = useFavoritesCityStore.getState()
            addCity({
                    id: '3',
                    name: '江门3',
                    adm2: '江门3',
                    lon: '3lon111',
                    lat: '3lat111',
                })
            const local = localStorage.getItem('favorites-city-list')
            expect(local).toBeTruthy()
        })  
    })

})