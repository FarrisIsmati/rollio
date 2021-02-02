'''
Sets up directories for simple imports
'''
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))
sys.path.append(str(Path(__file__).resolve().parents[1]) + '/src')
sys.path.append(str(Path(__file__).resolve().parents[1]) + '/nlp')
sys.path.append(str(Path(__file__).resolve().parents[1]) + '/data')
sys.path.append(str(Path(__file__).resolve().parents[1]) + '/model')