text = "ABCDEFG sharp DFA minor BDF major G flat B sharp"
print("original string: \"{}\"".format(text))
text = str.lower(text)
print(text)
text = str.split(text)
print(text)
# for item in text:
#     if item == 'sharp' or item == 'flat' or item == 'major' or item == 'minor':
#         print(item)
for i in range(len(text) - 1):
    if text[i] == 'sharp' or text[i] == 'flat' or text[i] == 'major' or text[i] == 'minor':
        print(text[i])
        text[i] = text[i-1][len(text[i-1]) - 1] + text[i]
        text[i-1] = text[i-1].replace(text[i-1][len(text[i-1]) - 1], "")
        if text[i-1] == "":
            text.pop(i-1)
print(text)
text2 = text
for i in range(len(text) - 1):
    if 'sharp' in text[i] or'flat' in text[i] or 'major' in text[i] or 'minor' in text[i]:
        # print(text[i])
        print()
    else:
        notelist = []
        print(text[i])
        for j in range(len(text[i])):
            notelist += [text[i][j]]
        print(notelist)
        # for x in notelist:
        #     text2.insert(i + j, x)
        #     # text2[i+j] = x
        # # for j in range(len(text[i])):
        # #     # text.insert(i + j + 1, str.split(text[i])[j])
        # #     print(text[i][j])
        # #     # text2.insert(i + j , text[i][j])
print(text)
print(text2)
