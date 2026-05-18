const { page, ok } = require('./utils')

const dictData = {
  sys_normal_disable: [
    { dictLabel: '正常', dictValue: '0', listClass: 'primary', cssClass: '' },
    { dictLabel: '停用', dictValue: '1', listClass: 'danger', cssClass: '' }
  ],
  sys_user_sex: [
    { dictLabel: '男', dictValue: '0', listClass: '', cssClass: '' },
    { dictLabel: '女', dictValue: '1', listClass: '', cssClass: '' },
    { dictLabel: '未知', dictValue: '2', listClass: '', cssClass: '' }
  ],
  sys_show_hide: [
    { dictLabel: '显示', dictValue: '0', listClass: 'primary', cssClass: '' },
    { dictLabel: '隐藏', dictValue: '1', listClass: 'danger', cssClass: '' }
  ],
  sys_yes_no: [
    { dictLabel: '是', dictValue: 'Y', listClass: 'primary', cssClass: '' },
    { dictLabel: '否', dictValue: 'N', listClass: 'danger', cssClass: '' }
  ],
  sys_notice_status: [
    { dictLabel: '正常', dictValue: '0', listClass: 'primary', cssClass: '' },
    { dictLabel: '关闭', dictValue: '1', listClass: 'danger', cssClass: '' }
  ],
  sys_notice_type: [
    { dictLabel: '通知', dictValue: '1', listClass: 'warning', cssClass: '' },
    { dictLabel: '公告', dictValue: '2', listClass: 'success', cssClass: '' }
  ],
  sys_job_status: [
    { dictLabel: '正常', dictValue: '0', listClass: 'primary', cssClass: '' },
    { dictLabel: '暂停', dictValue: '1', listClass: 'danger', cssClass: '' }
  ],
  sys_job_group: [
    { dictLabel: '默认', dictValue: 'DEFAULT', listClass: '', cssClass: '' },
    { dictLabel: '系统', dictValue: 'SYSTEM', listClass: '', cssClass: '' }
  ]
}

const sampleUsers = [
  {
    userId: 1,
    userName: 'admin',
    nickName: '管理员',
    phonenumber: '15888888888',
    status: '0',
    createTime: '2024-01-01 00:00:00',
    dept: { deptId: 100, deptName: '若依科技' }
  },
  {
    userId: 2,
    userName: 'ry',
    nickName: '若依',
    phonenumber: '15666666666',
    status: '0',
    createTime: '2024-01-02 00:00:00',
    dept: { deptId: 105, deptName: '测试部门' }
  }
]

const deptTree = [
  {
    id: 100,
    label: '若依科技',
    children: [
      { id: 101, label: '深圳总公司', children: [{ id: 103, label: '研发部门' }, { id: 104, label: '市场部门' }] },
      { id: 102, label: '长沙分公司', children: [{ id: 108, label: '市场部门' }] }
    ]
  }
]

module.exports = [
  {
    url: '/system/dict/data/type/:dictType',
    type: 'get',
    response: req => {
      const dictType = req.params.dictType
      return ok({ data: dictData[dictType] || [] })
    }
  },
  {
    url: '/system/user/deptTree',
    type: 'get',
    response: () => ok({ data: deptTree })
  },
  {
    url: '/system/user/list',
    type: 'get',
    response: () => page(sampleUsers, sampleUsers.length)
  },
  {
    url: '/system/dept/list',
    type: 'get',
    response: () => ok({ data: deptTree })
  },
  {
    url: '/system/role/list',
    type: 'get',
    response: () => page([
      { roleId: 1, roleName: '超级管理员', roleKey: 'admin', status: '0', createTime: '2024-01-01 00:00:00' }
    ], 1)
  },
  {
    url: '/system/menu/list',
    type: 'get',
    response: () => ok({ data: [] })
  },
  {
    url: '/system/post/list',
    type: 'get',
    response: () => page([], 0)
  },
  {
    url: '/system/dict/type/list',
    type: 'get',
    response: () => page([], 0)
  },
  {
    url: '/system/dict/data/list',
    type: 'get',
    response: () => page([], 0)
  },
  {
    url: '/system/config/list',
    type: 'get',
    response: () => page([], 0)
  },
  {
    url: '/system/notice/list',
    type: 'get',
    response: () => page([], 0)
  },
  {
    url: '/system/notice/listTop',
    type: 'get',
    response: () => ok({ data: [] })
  }
]
