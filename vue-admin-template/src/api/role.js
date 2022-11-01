import request from '@/utils/request'
export function getRoles(data) {
    return request({
      url: 'admin/role/getAllByPages',
      method: 'post',
      data
    })
  }
  export function add(data) {
    return request({
      url: 'admin/role/add',
      method: 'post',
      data
    })
  }
  export function update(data) {
    return request({
      url: 'admin/role/update',
      method: 'post',
      data
    })
  }
  export function getRoot(data) {
    return request({
      url: 'admin/role/root',
      method: 'post',
      data
    })
  }