export function statelist() {
  return [
    { value: 1, name: '正常',key:'normal' },
    { value: 2, name: '删除' ,key:'delete'},
    { value: 3, name: '停用' ,key:'stop'}
  ];
}

export function stateText(val) {
  let result = '正常';
  switch (val) {
    case 1:
      result = '正常';
      break;
    case 2:
      result = '删除';
      break;
    case 3:
      result = '停用';
      break;
    default:
      break;
  }

  return result;
}
