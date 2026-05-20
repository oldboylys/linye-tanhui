/**
 * /getInfo 模拟数据（对齐若依 SysUser 字段）
 */
const userProfiles = {
  'mock-admin-token': {
    user: {
      userId: 1,
      deptId: 100,
      userName: 'admin',
      nickName: '管理员',
      email: 'admin@jiangkou.gov.cn',
      phonenumber: '15888888888',
      sex: '0',
      avatar: '',
      status: '0',
      loginIp: '127.0.0.1',
      loginDate: '2024-04-01 09:00:00',
      createTime: '2024-01-01 00:00:00',
      remark: '江口县碳汇开发管理平台超级管理员',
      dept: {
        deptId: 100,
        parentId: 0,
        deptName: '江口县林业局',
        orderNum: 0,
        leader: '张主任',
        status: '0'
      },
      roles: [
        { roleId: 1, roleName: '超级管理员', roleKey: 'admin', roleSort: 1, status: '0' }
      ]
    },
    roles: ['admin'],
    permissions: ['*:*:*'],
    isDefaultModifyPwd: false,
    isPasswordExpired: false,
    pwdChrtype: 0
  }
}

module.exports = {
  userProfiles
}
