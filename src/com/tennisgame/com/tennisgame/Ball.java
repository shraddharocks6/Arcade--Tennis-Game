package com.tennisgame;

import java.awt.Color;
import java.awt.Graphics;

public class Ball {
    private int x;
    private int y;
    private int size = 20;
    private int xSpeed = -2;
    private int ySpeed = -2;

    public Ball(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void update() {
        x += xSpeed;
        y += ySpeed;
        
        if (x <= 0 || x >= Game.WIDTH - size) {
            xSpeed *= -1;
        }
        
        if (y <= 0 || y >= Game.HEIGHT - size) {
            ySpeed *= -1;
        }
    }

    public void render(Graphics g) {
        g.setColor(Color.WHITE);
        g.fillOval(x, y, size, size);
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getSize() {
        return size;
    }

    public void setXSpeed(int speed) {
        xSpeed = speed;
    }

    public void setYSpeed(int speed) {
        ySpeed = speed;
    }
}
