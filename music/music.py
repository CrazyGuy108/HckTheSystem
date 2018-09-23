from music21 import converter, instrument, note, chord, stream, duration
import sys
#**************************************************************************
s = stream.Stream()
#text = "F sharp F sharp GA major A major GF sharp ED major D major EF sharp F sharp EE"
text = sys.stdin.readline()
# print("original string: \"{}\"".format(text))
text = str.lower(text)
# print(text)
text = str.split(text)
# print(text)
# for item in text:
#     if item == 'sharp' or item == 'flat' or item == 'major' or item == 'minor':
#         print(item)
text2 = text
for i in range(len(text) - 1):
    # print(i)
    if text[i] == 'sharp' or text[i] == 'flat' or text[i] == 'major' or text[i] == 'minor':
        # print(text[i])
        text[i] = text[i-1][len(text[i-1]) - 1] + text[i]
        text[i-1] = text[i-1].replace(text[i-1][len(text[i-1]) - 1], "")
        # if text[i-1] == "":
        #     text.pop(i-1)

text = [x for x in text if not x == ""]

# print(text)
# text2 = text
for i in range(len(text)):
    if 'sharp' in text[i] or'flat' in text[i] or 'major' in text[i] or 'minor' in text[i]:
        # print(text[i])
        # print()
        if text[i] == 'cmajor':
            s.append(chord.Chord(['c', 'e', 'g']))
        if text[i] == 'dmajor':
            s.append(chord.Chord(['d', 'f#', 'a']))
        if text[i] == 'emajor':
            s.append(chord.Chord(['e', 'g#', 'b']))
        if text[i] == 'fmajor':
            s.append(chord.Chord(['f', 'a', 'c']))
        if text[i] == 'gmajor':
            s.append(chord.Chord(['g', 'b', 'd']))
        if text[i] == 'amajor':
            s.append(chord.Chord(['a', 'c#', 'e']))
        if text[i] == 'bmajor':
            s.append(chord.Chord(['b', 'd#', 'f#']))
        if text[i] == 'cminor':
            s.append(chord.Chord(['c', 'e-', 'g']))
        if text[i] == 'dminor':
            s.append(chord.Chord(['d', 'f', 'a']))
        if text[i] == 'eminor':
            s.append(chord.Chord(['e', 'g', 'b']))
        if text[i] == 'fminor':
            s.append(chord.Chord(['f', 'a-', 'c']))
        if text[i] == 'gminor':
            s.append(chord.Chord(['g', 'b-', 'd']))
        if text[i] == 'aminor':
            s.append(chord.Chord(['a', 'c', 'e']))
        if text[i] == 'bminor':
            s.append(chord.Chord(['b', 'd', 'f#']))
        if 'sharp' in text[i]:
            s.append(note.Note(text[i][0] + "#"))
        if 'flat' in text[i]:
            s.append(note.Note(text[i][0] + "-"))
    else:
        notelist = []
        # print(text[i])
        for j in range(len(text[i])):
            if not text[i] == []:
                notelist += [text[i][j]]
        # print(notelist)
        for x in notelist:
            s.append(note.Note(x, type = 'quarter'))
        # for x in notelist:
        #     text2.insert(i + j, x)
        #     # text2[i+j] = x
        # # for j in range(len(text[i])):
        # #     # text.insert(i + j + 1, str.split(text[i])[j])
        # #     print(text[i][j])
        # #     # text2.insert(i + j , text[i][j])
# print(text)
print(open(s.write("midi"), mode='rb').read())

#*************************************************************************

# item_list = text
# s = stream.Stream()
# for item in item_list:
#         s.append(note.Note(item, type = 'quarter'))
# s.write("midi", "music/output.midi")
