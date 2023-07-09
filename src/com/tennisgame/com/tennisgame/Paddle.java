package com.tennisgame;

import java.awt.Color;
import java.awt.Graphics;

public class Paddle {
    private int x;
    private int y;
    private int width = 20;
    private int height = 80;
    private int ySpeed = 0;

    public Paddle(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void update() {
        y += ySpeed;
    }

    public void render(Graphics g) {
        g.setColor(Color.WHITE);
        g.fillRect(x, y, width, height);
    }

    public void setYSpeed(int speed) {
        ySpeed = speed;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }
}
