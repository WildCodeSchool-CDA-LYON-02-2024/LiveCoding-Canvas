function collision(obj1, obj2) {
    return obj1.x < obj2.getImg().width + obj2.x
        && obj1.x + obj1.getImg().width > obj2.x
        && obj1.y < obj2.getImg().height + obj2.y
        && obj1.y + obj1.getImg().height > obj2.y
}

export { collision }