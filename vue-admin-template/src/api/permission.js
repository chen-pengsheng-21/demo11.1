import request from '@/utils/request'

export function getPermissionByPages(data) {
  return request({
    url: 'admin/permission/getPermissionByPages',
    method: 'post',
    data
  })
}
export function addPermission(data) {
  return request({
    url: 'admin/permission/addPermissionRecord',
    method: 'post',
    data
  })
}
export function updatePermission(data) {
  return request({
    url: 'admin/permission/addPermissionRecord',
    method: 'post',
    data
  })
}
export function getRoot(data) {
  return request({
    url: 'admin/premission/root',
    method: 'post',
    data
  })
}
