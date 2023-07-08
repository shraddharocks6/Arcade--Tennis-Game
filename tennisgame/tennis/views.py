from django.shortcuts import render

def tennis_game(request):
    return render(request, 'tennis/game.html')
