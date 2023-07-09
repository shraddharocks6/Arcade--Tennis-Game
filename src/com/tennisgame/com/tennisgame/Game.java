package com.tennisgame;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.Timer;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class Game extends JPanel implements ActionListener {
    public static final int WIDTH = 800;
    public static final int HEIGHT = 600;

    private Paddle paddle1;
    private Paddle paddle2;
    private Ball ball;

    public Game() {
        setPreferredSize(new Dimension(WIDTH, HEIGHT));
        setBackground(Color.BLACK);

        paddle1 = new Paddle(20, HEIGHT / 2 - 40);
        paddle2 = new Paddle(WIDTH - 40, HEIGHT / 2 - 40);
        ball = new Ball(WIDTH / 2 - 10, HEIGHT / 2 - 10);

        addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                handleKeyPress(e);
            }

            @Override
            public void keyReleased(KeyEvent e) {
                handleKeyRelease(e);
            }
        });
        setFocusable(true);
    }

    private void handleKeyPress(KeyEvent e) {
        int keyCode = e.getKeyCode();

        if (keyCode == KeyEvent.VK_W) {
            paddle1.setYSpeed(-3);
        } else if (keyCode == KeyEvent.VK_S) {
            paddle1.setYSpeed(3);
        } else if (keyCode == KeyEvent.VK_UP) {
            paddle2.setYSpeed(-3);
        } else if (keyCode == KeyEvent.VK_DOWN) {
            paddle2.setYSpeed(3);
        }
    }

    private void handleKeyRelease(KeyEvent e) {
        int keyCode = e.getKeyCode();

        if (keyCode == KeyEvent.VK_W || keyCode == KeyEvent.VK_S) {
            paddle1.setYSpeed(0);
        } else if (keyCode == KeyEvent.VK_UP || keyCode == KeyEvent.VK_DOWN) {
            paddle2.setYSpeed(0);
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        paddle1.update();
        paddle2.update();
        ball.update();
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        paddle1.render(g);
        paddle2.render(g);
        ball.render(g);
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("tennis Game");
        Game game = new Game();
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
        frame.getContentPane().add(game);
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        Timer timer = new Timer(5, game);
        timer.start();
    }
}
