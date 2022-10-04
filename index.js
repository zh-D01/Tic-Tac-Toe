/*
    单元格点击：

    1 获取到所有的单元格列表。
    2 遍历单元格列表，给每一个单元格添加点击事件。
    3 给当前被点击的单元格添加类名 X。
    优化(1)：防止单元格重复点击，在添加事件时，使用once属性，让单元格只能被点击一次。
    优化(2)：使用函数声明形式的事件处理程序(代码多了后，代码结构会更清晰)。
*/
// 单元格列表
var cells = document.querySelectorAll('.cell');
/*
    切换玩家

    1.创建一个存储当前玩家的变量(currentPlayer)，默认值为：x。
    2.将添加给单元格时写死的类名x,替换为变量(currentPlayer)的值。
    3.切换到另一个玩家：在添加类名(下棋完成一步)后，根据当前玩家，得到另外一个玩家。
    4.处理下一步提示，移除游戏面板中的x和o类名，添加下一个玩家对应的类名。
*/
// 游戏面板
var gameBord = document.querySelector('#bord');
// 获胜信息面板
var message = document.querySelector('#message');
// 获胜者
var winner = document.querySelector('#winner');
// 重新开始按钮
var restart = document.querySelector('#restart');
/*
    使用枚举修改当前玩家

    1.创建字符串枚举(Player),提供x和o两个成员。
    2.将成员x的值设置为：'x'(类名);将成员o的值设置为：'o'(类名)。
    3.将变量(currentPlayer)的类型设置为Player枚举类型，默认值为Player.x。
    4.将所有用到x和o的地方全部使用枚举成员代替。
*/
// 玩家枚举
var Player;
(function (Player) {
    Player["X"] = "x";
    Player["O"] = "o";
})(Player || (Player = {}));
// 判赢数组
var winsArr = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6] //斜
];
// 当前玩家
var currentPlayer;
// console.log(gameBord);
// 记录已下棋的次数
var steps;
/*
    重新游戏
    1 获取到重新开始按钮(#restart)，并绑定点击事件。
    2 在点击事件中，重置游戏数据。
    3 隐藏获胜信息，清空棋盘，移除单元格点击事件、重新给单元格绑定点击事件。
    4 重置下棋次数、重置默认玩家为 x、重置下棋提示为 x。
*/
/*
    优化重新游戏功能：
    1 将重新开始按钮的事件处理程序修改为：函数声明形式(startGame)
    2 直接调用函数(startGame)，来开始游戏。
    3 移除变量 steps、currentPlayer 的默认值，并添加明确的类型注解。
    4 移除单元格绑定事件的代码。
*/
restart.addEventListener('click', startGame);
// 调用该函数来初始化游戏数据，开始游戏
startGame();
function startGame() {
    // 隐藏获胜信息
    message.style.display = 'none';
    // 重置下棋次数
    steps = 0;
    // 重置默认玩家为 x、重置下棋提示为 x
    currentPlayer = Player.X;
    cells.forEach(function (item) {
        var cell = item;
        // 清空棋盘
        cell.classList.remove(Player.X, Player.O);
        // 移除单元格点击事件、重新给单元格绑定点击事件。
        cell.removeEventListener('click', clickCell);
        cell.addEventListener('click', clickCell, { once: true });
    });
}
// 给单元格绑定点击事件
// cells.forEach(function (item) {
//     let cell = item as HTMLElement
//     // console.log(item);
//     cell.addEventListener('click', clickCell, { once: true })
// })
// 棋盘中单元格的click事件处理程序
function clickCell(event) {
    // console.log('click', event.target);
    var target = event.target;
    target.classList.add(currentPlayer);
    steps++;
    /*
        展示获胜信息：
        1 获取到与获胜信息相关的两个DOM元素：1 #message 2#winner
        2 显示获胜信息面板(通过 style 属性实现)。
        3 展示获胜信息：
            如果获胜，展示“x，赢了！”或“o，赢了！”:
            如果是平局，展示“平局”。
    */
    // 调用判赢函数判断是否获胜
    var isWin = checkWin(currentPlayer);
    if (isWin) {
        message.style.display = 'block';
        winner.innerText = currentPlayer + ' 赢了';
        // 因为游戏已经结束，所以，此处直接 return
        // 来可以阻止后续代码执行
        return;
    }
    // console.log('获胜之后');
    // 判断平局
    if (steps === 9) {
        message.style.display = 'block';
        winner.innerText = '平局';
        // 因为游戏已经结束，所以，此处直接 return
        // 来可以阻止后续代码执行
        return;
    }
    /*
    判断平局：
        1 创建变量(steps)，默认值为 0。
        2 在玩家下棋后，让 steps 加 1。
        3 在判赢的代码后面，判断 steps 是否等于 9。
        4 如果等于 9 说明是平局，游戏结束，就直接 return，不再执行后续代码。
    */
    // 关键点：
    // 根据当前玩家，得到另外一个玩家
    currentPlayer = currentPlayer === Player.X ? Player.O : Player.X;
    // 处理下一步提示
    gameBord.classList.remove(Player.X, Player.O);
    gameBord.classList.add(currentPlayer);
}
// 封装判赢函数
function checkWin(player) {
    /*
        实现判赢函数：
        1.使用 some 方法遍历数组，并使用 some 方法的返回值作为判赢函数的返回结果。
        2.在 some 方法的回调函数中，获取到每种获胜情况对应的 3 个单元格元素。
        3.判断这 3 个单元格元素是否同时包含当前玩家的类名。
        4.如果包含（玩家获胜），就是回调函数中返回true停止循环：否则，返回false，继续下一次循环。
    */
    /* 优化
        1.去掉判赢函数的中间变量(isWin、cell1、cell2、cell3)。
        2.封装函数(hasClass)：判断 DOM 元素是否包含某个类名。
    */
    return winsArr.some(function (item) {
        // 获取到每种获胜情况对应的 3 个单元格元素
        // 2.1 先拿到每种获胜情况的三个索引
        // console.log(item)
        var cellIndex1 = item[0];
        var cellIndex2 = item[1];
        var cellIndex3 = item[2];
        // 3 判断这 3 个单元格元素是否同时包含当前玩家的类名
        // 重点：
        // 1 元素是否包含类名 classList.contains()
        // 2 同时包含（第一个包含 并且 第二个包含 并且 第三个包含）
        //      逻辑运算符 && 逻辑与
        if (
        // cells[cellIndex1].classList.contains(player) &&
        // cells[cellIndex2].classList.contains(player) &&
        // cells[cellIndex3].classList.contains(player)
        hasClass(cells[cellIndex1], player) &&
            hasClass(cells[cellIndex2], player) &&
            hasClass(cells[cellIndex3], player)) {
            return true;
        }
        return false;
    });
}
// 封装 hasClass 函数：判断 DOM 元素是否包含某个类名。
function hasClass(el, name) {
    return el.classList.contains(name);
}
