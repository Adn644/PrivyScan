from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("nlpaueb/legal-bert-base-uncased")

MAX_TOKENS = 500


def clean_text(text: str) -> str:
    text = text.replace("\r", "\n")
    text = "\n".join(
        line.strip() for line in text.split("\n") if line.strip()
    )
    return text


def chunk_by_paragraph(text: str, max_tokens: int = MAX_TOKENS):
    text = clean_text(text)
    paragraphs = text.split("\n")

    chunks = []
    current_paragraphs = []
    current_tokens = 0

    for para in paragraphs:
        para_tokens = len(
            tokenizer.encode(para, add_special_tokens=False)
        )

        if para_tokens > max_tokens:
            if current_paragraphs:
                chunk_text = " ".join(current_paragraphs)
                chunks.append(chunk_text.strip())

            tokens = tokenizer.encode(
                para,
                add_special_tokens=False
            )

            for i in range(0, len(tokens), max_tokens):
                sub_chunk = tokenizer.decode(
                    tokens[i:i + max_tokens],
                    skip_special_tokens=True
                )
                chunks.append(sub_chunk.strip())

            current_paragraphs = []
            current_tokens = 0
            continue

        if current_tokens + para_tokens <= max_tokens:
            current_paragraphs.append(para)
            current_tokens += para_tokens
        else:
            chunk_text = " ".join(current_paragraphs)
            chunks.append(chunk_text.strip())

            current_paragraphs = [para]
            current_tokens = para_tokens

    if current_paragraphs:
        chunk_text = " ".join(current_paragraphs)
        chunks.append(chunk_text.strip())

    return chunks